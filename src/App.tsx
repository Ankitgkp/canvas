import React, { useState, useEffect } from 'react';
import { AuthContainer } from './AuthContainer';
import { AuthService } from './auth';
import { DrawingCanvas } from './drawingCanvas';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status on app load
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
    // Get user info after successful authentication
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
  };

  if (!isAuthenticated) {
    return <AuthContainer onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header with user info and logout */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Drawing App</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-medium">{user.username}</span>
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Canvas App Container - we'll load the original HTML content here */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div id="canvas-app-container" className="w-full max-w-7xl">
          {/* This will contain the original canvas app HTML */}
          <CanvasAppContent />
        </div>
      </div>
    </div>
  );
};

// Component to render the original canvas app HTML
const CanvasAppContent: React.FC = () => {
  useEffect(() => {
    // Initialize the drawing canvas after the component mounts
    const initCanvas = () => {
      // Only initialize if not already initialized
      if (!document.querySelector('#canvas')) {
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
                  <input type="range" id="size-slider" min="1" max="20" defaultValue="5" 
                         class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div class="space-y-2">
                  <button id="undo" class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded">
                    Undo
                  </button>
                  <button id="redo" class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded">
                    Redo
                  </button>
                  <button id="clear" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    Clear
                  </button>
                  <button id="download" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                    Download
                  </button>
                </div>
              </section>

              <div id="canvas-container" class="w-full pl-10">
                <canvas id="canvas"></canvas>
              </div>
            </div>
          `;
          
          // Initialize the drawing canvas
          new DrawingCanvas();
        }
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(initCanvas, 100);
  }, []);

  return <div id="canvas-app-container"></div>;
};

export default App;
