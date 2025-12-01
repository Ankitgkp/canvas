import React, { useState, useEffect } from 'react';
import { AuthContainer } from './AuthContainer';
import { AuthService } from './auth';
import { DrawingCanvas } from './drawingCanvas';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentRoom, setCurrentRoom] = useState<any>(null);

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      AuthService.verifyToken(token).then(result => {
        if (result.valid) {
          setIsAuthenticated(true);
          setUser(result.user);
        } else {
          AuthService.removeToken();
        }
      }).catch(() => {
        AuthService.removeToken();
      });
    }
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    const token = AuthService.getToken();
    if (token) {
      AuthService.verifyToken(token).then(result => {
        if (result.valid) {
          setUser(result.user);
        }
      });
    }
  };

  const handleLogout = () => {
    AuthService.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentRoom(null);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  if (!isAuthenticated) {
    return <AuthContainer onAuthenticated={handleAuthenticated} />;
  }

  if (!currentRoom) {
    return <RoomSelector user={user} onLogout={handleLogout} onJoinRoom={setCurrentRoom} />;
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Drawing App</h1>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Room: {currentRoom.roomCode}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-medium">{user.username}</span>
                </span>
              )}
              <button
                onClick={handleLeaveRoom}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Leave Room
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div id="canvas-app-container" className="w-full max-w-7xl">
          <CanvasAppContent roomCode={currentRoom.roomCode} />
        </div>
      </div>
    </div>
  );
};

const RoomSelector: React.FC<{ user: any; onLogout: () => void; onJoinRoom: (room: any) => void }> = ({ user, onLogout, onJoinRoom }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const myRooms = await AuthService.getMyRooms();
      setRooms(myRooms);
    } catch (err) {
      console.log("Could not load rooms");
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const room = await AuthService.createRoom(roomName);
      onJoinRoom(room);
    } catch (err) {
      setError('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Room code is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const room = await AuthService.joinRoom(roomCode.toUpperCase());
      onJoinRoom(room);
    } catch (err) {
      setError('Room not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Drawing App</h1>
            <div className="flex items-center space-x-4">
              {user && <span className="text-sm text-gray-700">Welcome, <span className="font-medium">{user.username}</span></span>}
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Join or Create Room</h2>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Join Existing Room</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleJoinRoom} disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Join
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Create New Room</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button onClick={handleCreateRoom} disabled={loading} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Create
              </button>
            </div>
          </div>

          {rooms.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Your Rooms</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {rooms.map((room) => (
                  <div key={room.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <span className="font-medium">{room.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({room.roomCode})</span>
                    </div>
                    <button onClick={() => onJoinRoom(room)} className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded">
                      Enter
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CanvasAppContent: React.FC<{ roomCode: string }> = ({ roomCode }) => {
  useEffect(() => {
    const initCanvas = () => {
      const container = document.getElementById('canvas-app-container');
      if (container) {
        container.innerHTML = `
          <div id="app" class="flex items-center justify-center w-full">
            <section id="menu-container" class="flex flex-col items-center justify-center p-10 bg-gray-100 rounded-lg min-h-[500px]">
              <h1 class="text-xl font-bold mb-4">Tools</h1>
              <hr class="w-full h-px bg-purple-200 border-0 mb-4" />
              <div id="brush-colors" class="grid grid-cols-3 gap-4 mb-6">
                <button class="brush-select black" data-br-color="#101010" title="Black"></button>
                <button class="brush-select blue" data-br-color="lightskyblue" title="Blue"></button>
                <button class="brush-select yellow" data-br-color="gold" title="Yellow"></button>
                <button class="brush-select green" data-br-color="lightgreen" title="Green"></button>
                <button class="brush-select purple" data-br-color="mediumpurple" title="Purple"></button>
                <button class="brush-select red" data-br-color="lightcoral" title="Red"></button>
              </div>
              <div class="w-full mb-4">
                <label for="size-slider" class="block text-sm font-medium text-gray-700 mb-2">Brush Size</label>
                <input type="range" id="size-slider" min="1" max="20" defaultValue="5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div class="space-y-2">
                <button id="undo" class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded">Undo</button>
                <button id="redo" class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded">Redo</button>
                <button id="clear" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Clear</button>
                <button id="download" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Download</button>
              </div>
            </section>
            <div id="canvas-container" class="w-full pl-10">
              <canvas id="canvas"></canvas>
            </div>
          </div>
        `;
        new DrawingCanvas(roomCode);
      }
    };
    setTimeout(initCanvas, 100);
  }, [roomCode]);

  return <div id="canvas-app-container"></div>;
};

export default App;
