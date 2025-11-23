// Placeholder for API service calls
export const api = {
  login: async (username: string, password: string) => {
    console.log(`Attempting to login with ${username}:${password}`);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === "admin" && password === "password") {
          resolve({ success: true, token: "fake-jwt-token" });
        } else {
          resolve({ success: false, message: "Invalid credentials" });
        }
      }, 1000);
    });
  },
  // Other API calls will be added here
};
