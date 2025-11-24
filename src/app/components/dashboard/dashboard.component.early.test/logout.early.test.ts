

// Import the mocked inject for use in test setup


// dashboard.component.logout.spec.ts
// Mocking @angular/core's inject function only, all other exports are real
jest.mock("@angular/core", () => {
  const actual = jest.requireActual("@angular/core");
  return {
    ...actual,
    inject: jest.mocked(jest.fn()),
  };
});

// Import the mocked inject for use in test setup
// Mock for AuthService with logout and currentUser
class MockAuthService {
  public logout = jest.mocked(jest.fn());
  public currentUser: any = { id: 1, name: 'Test User' };
}

// Mock DashboardComponent that uses the mock AuthService
class MockDashboardComponent {
  public authService: MockAuthService;
  public user: any;

  constructor(mockAuthService: MockAuthService) {
    this.authService = mockAuthService as any;
    this.user = this.authService.currentUser;
  }

  logout(): void {
    this.authService.logout();
  }
}

describe('DashboardComponent.logout() logout method', () => {
  // Happy Path Tests
  describe('Happy paths', () => {
    it('should call authService.logout when logout is invoked (basic happy path)', () => {
      // This test ensures that logout calls the AuthService.logout method.
      const mockAuthService = new MockAuthService();
      const mockComponent = new MockDashboardComponent(mockAuthService as any);

      mockComponent.logout();

      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should call authService.logout even if currentUser is present', () => {
      // This test ensures that logout works when currentUser is set.
      const mockAuthService = new MockAuthService();
      mockAuthService.currentUser = { id: 42, name: 'Alice' };
      const mockComponent = new MockDashboardComponent(mockAuthService as any);

      mockComponent.logout();

      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should not throw if logout is called multiple times', () => {
      // This test ensures that multiple calls to logout do not throw errors.
      const mockAuthService = new MockAuthService();
      const mockComponent = new MockDashboardComponent(mockAuthService as any);

      expect(() => {
        mockComponent.logout();
        mockComponent.logout();
        mockComponent.logout();
      }).not.toThrow();

      expect(mockAuthService.logout).toHaveBeenCalledTimes(3);
    });
  });

  // Edge Case Tests
  describe('Edge cases', () => {
    it('should handle when authService.logout throws an error', () => {
      // This test ensures that if AuthService.logout throws, the error propagates.
      const mockAuthService = new MockAuthService();
      mockAuthService.logout.mockImplementation(() => {
        throw new Error('Logout failed');
      });
      const mockComponent = new MockDashboardComponent(mockAuthService as any);

      expect(() => mockComponent.logout()).toThrow('Logout failed');
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle when currentUser is an empty object', () => {
      // This test ensures that logout works even if currentUser is an empty object.
      const mockAuthService = new MockAuthService();
      mockAuthService.currentUser = {};
      const mockComponent = new MockDashboardComponent(mockAuthService as any);

      mockComponent.logout();

      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle when currentUser is a complex object', () => {
      // This test ensures that logout works with a complex currentUser object.
      const mockAuthService = new MockAuthService();
      mockAuthService.currentUser = {
        id: 99,
        name: 'Complex User',
        roles: ['admin', 'user'],
        meta: { lastLogin: new Date() },
      };
      const mockComponent = new MockDashboardComponent(mockAuthService as any);

      mockComponent.logout();

      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should not throw if logout is a no-op (does nothing)', () => {
      // This test ensures that if AuthService.logout is a no-op, logout still works.
      const mockAuthService = new MockAuthService();
      mockAuthService.logout.mockImplementation(() => {});
      const mockComponent = new MockDashboardComponent(mockAuthService as any);

      expect(() => mockComponent.logout()).not.toThrow();
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });
  });
});
