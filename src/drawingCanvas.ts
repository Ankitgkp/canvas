import { v4 as uuidv4 } from "uuid";
import { DEFAULT_CTX } from "./constants";
import { AuthService } from "./auth";

export class DrawingCanvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    colorSelectBtns: HTMLCollectionOf<Element>;
    sizeSlider: HTMLInputElement;
    undoBtn: HTMLButtonElement;
    redoBtn: HTMLButtonElement;
    clearBtn: HTMLButtonElement;
    downloadBtn: HTMLButtonElement;

    isDrawing: boolean;
    keysPressed: { [key: string]: boolean };
    roomCode: string;

    past: Array<{
        id: string;
        data: ImageData;
        dbId?: number;
    }>;
    future: Array<{
        id: string;
        data: ImageData;
        dbId?: number;
    }>;

    constructor(roomCode: string) {
        this.roomCode = roomCode;
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", {
            willReadFrequently: true,
        }) as CanvasRenderingContext2D;

        this.colorSelectBtns = document.getElementsByClassName(
            "brush-select"
        ) as HTMLCollectionOf<Element>;
        this.sizeSlider = document.getElementById(
            "size-slider"
        ) as HTMLInputElement;
        this.undoBtn = document.getElementById("undo") as HTMLButtonElement;
        this.redoBtn = document.getElementById("redo") as HTMLButtonElement;
        this.clearBtn = document.getElementById("clear") as HTMLButtonElement;
        this.downloadBtn = document.getElementById("download") as HTMLButtonElement;

        this.isDrawing = false;
        this.keysPressed = {};

        this.past = [];
        this.future = [];

        this.initCanvas();
        this.initUserEvents();
        this.initDrawingEvents();
        this.loadShapesFromServer();
    }

    async loadShapesFromServer() {
        try {
            const shapes = await AuthService.getShapes(this.roomCode);
            if (shapes && shapes.length > 0) {
                const lastShape = shapes[shapes.length - 1];
                const img = new Image();
                img.onload = () => {
                    this.ctx.drawImage(img, 0, 0);
                    this.past = [];
                    this.past.push({
                        id: lastShape.shapeId,
                        data: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
                        dbId: lastShape.id
                    });
                    this.undoBtn.disabled = false;
                };
                img.src = lastShape.data;
            }
        } catch (error) {
            console.log("Could not load shapes");
        }
    }

    canvasToBase64() {
        return this.canvas.toDataURL("image/png");
    }

    initCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        this.ctx.lineWidth = DEFAULT_CTX.lineWidth;
        this.ctx.strokeStyle = DEFAULT_CTX.strokeStyle;
        this.ctx.fillStyle = DEFAULT_CTX.fillStyle;
        this.ctx.lineCap = DEFAULT_CTX.lineCap;
        this.ctx.lineJoin = DEFAULT_CTX.lineJoin;
        // Sets canvas background
        this.ctx.fillRect(
            0,
            0,
            this.canvas.offsetWidth,
            this.canvas.offsetHeight
        );

        this.initHistory();
    }

    initHistory() {
        // Initial state available for undo
        const initialImageData = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.past.push({
            id: uuidv4(),
            data: initialImageData,
        });
    }

    initUserEvents() {
        this.undoBtn.disabled = true;
        this.redoBtn.disabled = true;

        this.sizeSlider.addEventListener("change", () => {
            this.ctx.lineWidth = Number(this.sizeSlider.value);
        });

        Array.from(this.colorSelectBtns).forEach((el: Element) => {
            el.addEventListener("click", () => {
                const brushColor = el.getAttribute("data-br-color");
                if (brushColor) {
                    this.ctx.strokeStyle = brushColor;
                    this.ctx.fillStyle = brushColor;
                }
            });
        });

        this.undoBtn.addEventListener("click", () => {
            this.undo();
        });

        this.redoBtn.addEventListener("click", () => {
            this.redo();
        });

        this.clearBtn.addEventListener("click", () => {
            this.clear();
        });

        this.downloadBtn.addEventListener("click", () => {
            this.download();
        });

        document.addEventListener("keydown", (event) => {
            this.keysPressed[event.key] = true;
            console.log(this.keysPressed);

            const ctrlCmdPressed =
                navigator.userAgent.indexOf("Mac") != -1
                    ? this.keysPressed["Meta"]
                    : this.keysPressed["Control"];

            if (ctrlCmdPressed && this.keysPressed["z"]) {
                this.undo();
            }

            if (
                ctrlCmdPressed &&
                this.keysPressed["Shift"] &&
                this.keysPressed["Z"]
            ) {
                this.redo();
            }
        });

        document.addEventListener("keyup", () => {
            for (const prop of Object.getOwnPropertyNames(this.keysPressed)) {
                delete this.keysPressed[prop];
            }
        });
    }

    initDrawingEvents() {
        this.canvas.addEventListener("mousedown", (e) => {
            if (this.isEventInsideCanvas(e)) {
                this.start();
            }
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.isDrawing || !this.isEventInsideCanvas(e)) return;
            this.draw(e);
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (this.isEventInsideCanvas(e)) {
                this.finish();
            }
        });
    }

    start() {
        this.isDrawing = true;
        this.ctx.beginPath();
    }

    draw(e: MouseEvent) {
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
    }

    finish() {
        this.isDrawing = false;

        const currentImageData = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        const uniqueId = uuidv4();
        
        const shapeEntry = {
            id: uniqueId,
            data: currentImageData,
            dbId: undefined as number | undefined
        };
        
        this.past.push(shapeEntry);
        this.trimStorage(this.past);
        this.undoBtn.disabled = false;

        this.future = [];
        this.redoBtn.disabled = true;

        this.saveShapeToServer(uniqueId, shapeEntry);
    }

    async saveShapeToServer(shapeId: string, shapeEntry: any) {
        try {
            const savedShape = await AuthService.saveShape(this.roomCode, shapeId, this.canvasToBase64());
            shapeEntry.dbId = savedShape.id;
        } catch (error) {
            console.log("Could not save shape");
        }
    }

    undo() {
        if (this.past.length === 0) return;

        const lastAddedImage = this.past.pop();

        if (lastAddedImage) {
            this.future.unshift(lastAddedImage);
            this.redoBtn.disabled = false;

            if (this.past.length > 0) {
                this.ctx.putImageData(
                    this.past[this.past.length - 1].data,
                    0,
                    0
                );
            }

            if (lastAddedImage.dbId) {
                this.deleteShapeFromServer(lastAddedImage.dbId);
            }
        }

        if (this.past.length <= 1) {
            this.undoBtn.disabled = true;
        }
    }

    async deleteShapeFromServer(dbId: number) {
        try {
            await AuthService.deleteShape(this.roomCode, dbId);
        } catch (error) {
            console.log("Could not delete shape");
        }
    }

    redo() {
        if (this.future.length === 0) return;

        const lastRemovedImage = this.future.shift();

        if (lastRemovedImage) {
            this.past.push(lastRemovedImage);
            this.trimStorage(this.past);
            this.undoBtn.disabled = false;

            this.ctx.putImageData(lastRemovedImage.data, 0, 0);

            this.saveShapeToServer(lastRemovedImage.id, lastRemovedImage);
        }

        if (this.future.length === 0) {
            this.redoBtn.disabled = true;
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.past = [];
        this.initHistory();
        this.redoBtn.disabled = true;

        this.deleteAllShapesFromServer();
    }

    async deleteAllShapesFromServer() {
        try {
            await AuthService.deleteAllShapes(this.roomCode);
        } catch (error) {
            console.log("Could not delete shapes");
        }
    }

    download() {
        const dataURL = this.canvas.toDataURL("image/png", 1);
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "my_canvas";
        link.click();
    }

    isEventInsideCanvas(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );
    }

    trimStorage(
        data: Array<{ id: string; data: ImageData; dbId?: number }>,
        MAX: number = 25
    ) {
        while (data.length > MAX) {
            data.shift();
        }
    }
}
