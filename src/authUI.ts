import { AuthService } from './auth';

export class AuthUI {
  private authContainer: HTMLDivElement;
  private appContainer: HTMLDivElement;
  private isLoginMode: boolean = true;

  constructor() {
    this.authContainer = this.createAuthContainer();
    this.appContainer = document.getElementById('app') as HTMLDivElement;
    
    this.init();
  }

  private init() {
    // Check if user is already authenticated
    const token = AuthService.getToken();
    if (token) {
      this.verifyTokenAndProceed(token);
    } else {
      this.showAuthContainer();
    }
  }

  private async verifyTokenAndProceed(token: string) {
    try {
      const result = await AuthService.verifyToken(token);
      if (result.valid) {
        this.hideAuthContainer();
        return;
      }
    } catch (error) {
      console.log('Token verification failed:', error);
    }
    
    // Token is invalid, show login
    AuthService.removeToken();
    this.showAuthContainer();
  }

  private createAuthContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = 'auth-container';
    container.innerHTML = `
      <div class="auth-modal">
        <div class="auth-header">
          <h1>Welcome to Drawing App</h1>
          <p>Please sign in to continue</p>
        </div>
        
        <div class="auth-tabs">
          <button id="login-tab" class="auth-tab active">Login</button>
          <button id="register-tab" class="auth-tab">Register</button>
        </div>

        <form id="auth-form" class="auth-form">
          <div id="register-fields" class="register-only" style="display: none;">
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" id="username" name="username" required>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
          </div>

          <div class="form-group">
            <button type="submit" id="auth-submit" class="auth-button">Login</button>
          </div>

          <div id="auth-error" class="error-message" style="display: none;"></div>
        </form>

        <div class="auth-footer">
          <p id="auth-switch">
            Don't have an account? <a href="#" id="switch-link">Sign up</a>
          </p>
        </div>
      </div>
    `;

    this.attachEventListeners(container);
    return container;
  }

  private attachEventListeners(container: HTMLDivElement) {
    const loginTab = container.querySelector('#login-tab') as HTMLButtonElement;
    const registerTab = container.querySelector('#register-tab') as HTMLButtonElement;
    const switchLink = container.querySelector('#switch-link') as HTMLAnchorElement;
    const form = container.querySelector('#auth-form') as HTMLFormElement;

    loginTab.addEventListener('click', () => this.switchMode(true));
    registerTab.addEventListener('click', () => this.switchMode(true));
    switchLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchMode(!this.isLoginMode);
    });

    form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  private switchMode(loginMode: boolean) {
    this.isLoginMode = loginMode;
    
    const loginTab = this.authContainer.querySelector('#login-tab') as HTMLButtonElement;
    const registerTab = this.authContainer.querySelector('#register-tab') as HTMLButtonElement;
    const registerFields = this.authContainer.querySelector('#register-fields') as HTMLDivElement;
    const submitButton = this.authContainer.querySelector('#auth-submit') as HTMLButtonElement;
    const switchText = this.authContainer.querySelector('#auth-switch p') as HTMLParagraphElement;

    if (loginMode) {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      registerFields.style.display = 'none';
      submitButton.textContent = 'Login';
      switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switch-link">Sign up</a>';
    } else {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerFields.style.display = 'block';
      submitButton.textContent = 'Register';
      switchText.innerHTML = 'Already have an account? <a href="#" id="switch-link">Sign in</a>';
    }

    // Re-attach event listener to new switch link
    const newSwitchLink = this.authContainer.querySelector('#switch-link') as HTMLAnchorElement;
    newSwitchLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchMode(!this.isLoginMode);
    });

    this.clearError();
  }

  private async handleFormSubmit(e: Event) {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    this.clearError();
    this.setLoading(true);

    try {
      let result;
      
      if (this.isLoginMode) {
        result = await AuthService.login(email, password);
      } else {
        if (!username) {
          throw new Error('Username is required for registration');
        }
        result = await AuthService.register(email, username, password);
      }

      // Store the token and proceed
      AuthService.setToken(result.token);
      this.hideAuthContainer();
      
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      this.setLoading(false);
    }
  }

  private showError(message: string) {
    const errorDiv = this.authContainer.querySelector('#auth-error') as HTMLDivElement;
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  private clearError() {
    const errorDiv = this.authContainer.querySelector('#auth-error') as HTMLDivElement;
    errorDiv.style.display = 'none';
  }

  private setLoading(loading: boolean) {
    const submitButton = this.authContainer.querySelector('#auth-submit') as HTMLButtonElement;
    submitButton.disabled = loading;
    submitButton.textContent = loading ? 'Please wait...' : (this.isLoginMode ? 'Login' : 'Register');
  }

  private showAuthContainer() {
    document.body.appendChild(this.authContainer);
    this.appContainer.style.display = 'none';
  }

  private hideAuthContainer() {
    if (this.authContainer.parentNode) {
      this.authContainer.parentNode.removeChild(this.authContainer);
    }
    this.appContainer.style.display = 'block';
  }

  public logout() {
    AuthService.removeToken();
    this.showAuthContainer();
  }
}
