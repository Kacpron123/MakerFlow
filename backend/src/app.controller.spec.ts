import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appServiceMock: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
            getUsers: jest.fn().mockResolvedValue([{ user_id: 1, name: 'Test' }]),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appServiceMock = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!" from getHello', () => {
      expect(appController.getHello()).toBe('Hello World!');
      expect(appServiceMock.getHello).toHaveBeenCalled();
    });

    it('should call appService.getUsers and return data', async () => {
      const result = await appController.getUsers();
      
      expect(appServiceMock.getUsers).toHaveBeenCalled();
      expect(result).toEqual([{ user_id: 1, name: 'Test' }]);
    });
  });
});
