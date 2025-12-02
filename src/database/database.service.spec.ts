// src/database/database.service.spec.ts (ZMODYFIKOWANY)
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { Pool } from 'pg'; // Importujemy Pool

// 1. Mockujemy całą bibliotekę 'pg', aby uniknąć rzeczywistego połączenia
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(), // Mockujemy połączenie
    query: jest.fn(),    // Mockujemy zapytanie
    end: jest.fn(),      // Mockujemy zakończenie
  };
  return { Pool: jest.fn(() => mPool) }; // Mockujemy konstruktor Pool
});

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(async () => {
    // 2. Zerowanie mocków przed każdym testem
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
      // DatabaseService używa zmockowanej klasy Pool
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    
    // 3. Pobieramy instancję zmockowanego Pool, aby móc sprawdzać wywołania
    mockPool = new Pool() as jest.Mocked<Pool>;
  });

  // Test 1: Upewnienie się, że serwis jest zdefiniowany i zainicjowany
  it('should be defined and initialize connection on module init', async () => {
    // onModuleInit jest wywoływany automatycznie przez .compile()
    expect(service).toBeDefined();
    // Sprawdzamy, czy konstruktor Pool został wywołany z configu .env
    expect(Pool).toHaveBeenCalled(); 
    // Sprawdzamy, czy funkcja connect została wywołana
    expect(mockPool.connect).toHaveBeenCalled(); 
  });

  // Test 2: Sprawdzenie, czy metoda query wywołuje query na Poolu
  it('should call pool.query when service.query is called', async () => {
    const mockRows = [{ id: 1, name: 'Test' }];
    // Ustawiamy, co ma zwrócić mock
    mockPool.query.mockResolvedValue({ rows: mockRows }); 

    const result = await service.query('SELECT * FROM test');
    
    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM test', undefined);
    expect(result).toEqual(mockRows);
  });
});