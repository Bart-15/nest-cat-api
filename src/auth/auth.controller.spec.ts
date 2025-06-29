/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Mock AuthService
    const mockAuthService = {
      signUp: jest.fn((email: string, password: string) =>
        Promise.resolve({ email, password }),
      ),
      signIn: jest.fn((email: string, password: string) =>
        Promise.resolve({ token: 'mock-token' }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call signUp method with correct parameters', async () => {
    const signUpDto = { email: 'test@example.com', password: 'password123' };
    await authController.signUp(signUpDto.email, signUpDto.password);
    expect(authService.signUp).toHaveBeenCalledWith(
      signUpDto.email,
      signUpDto.password,
    );
  });

  it('should call signIn method with correct parameters', async () => {
    const signInDto = { email: 'test@example.com', password: 'password123' };
    await authController.signIn(signInDto.email, signInDto.password);
    expect(authService.signIn).toHaveBeenCalledWith(
      signInDto.email,
      signInDto.password,
    );
  });
});
