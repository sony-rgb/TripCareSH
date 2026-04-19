import { AirlineService } from './AirlineService';
import { IAirlineRepository } from '../repositories/interfaces/IAirlineRepository';
import Flight from '../database/model/Flight';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';

const createMockFlight = (overrides = {}) => ({
  id: 1,
  userId: 'user123',
  departureDate: new Date('2024-03-20'),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as unknown as Flight);

const mockAirlineRepository = () => ({
  createFlight: jest.fn(),
  updateFlight: jest.fn(),
  findFlightsByUserId: jest.fn(),
});

describe('AirlineService', () => {
  let airlineService: AirlineService;
  let airlineRepository: Mocked<IAirlineRepository>;

  beforeEach(() => {
    airlineRepository = mockAirlineRepository() as any;
    airlineService = new AirlineService(airlineRepository);
  });

  describe('createFlight', () => {
    it('throws error if userId is missing', async () => {
      await expect(airlineService.createFlight('', '2024-03-20')).rejects.toThrow('Please provide both user ID and departure date');
    });

    it('throws error if departureDate is missing', async () => {
      await expect(airlineService.createFlight('user123', '')).rejects.toThrow('Please provide both user ID and departure date');
    });

    it('throws error if date format is invalid', async () => {
      await expect(airlineService.createFlight('user123', 'invalid-date')).rejects.toThrow('Invalid date format');
    });

    it('creates flight successfully', async () => {
      const mockFlight = createMockFlight();
      airlineRepository.createFlight.mockResolvedValue(mockFlight);

      const result = await airlineService.createFlight('user123', '2024-03-20');

      expect(airlineRepository.createFlight).toHaveBeenCalledWith({
        userId: 'user123',
        departureDate: expect.any(Date)
      });
      expect(result).toEqual(mockFlight);
    });
  });

  describe('updateFlight', () => {
    it('throws error if flight is missing', async () => {
      await expect(airlineService.updateFlight(null as any, '2024-03-20')).rejects.toThrow('Flight and new departure date are required');
    });

    it('throws error if newDepartureDate is missing', async () => {
      const mockFlight = createMockFlight();
      await expect(airlineService.updateFlight(mockFlight, '')).rejects.toThrow('Flight and new departure date are required');
    });

    it('throws error if date format is invalid', async () => {
      const mockFlight = createMockFlight();
      await expect(airlineService.updateFlight(mockFlight, 'invalid-date')).rejects.toThrow('Invalid date format');
    });

    it('updates flight successfully', async () => {
      const mockFlight = createMockFlight();
      const updatedFlight = createMockFlight({ departureDate: new Date('2024-03-21') });
      airlineRepository.updateFlight.mockResolvedValue(updatedFlight);

      const result = await airlineService.updateFlight(mockFlight, '2024-03-21');

      expect(airlineRepository.updateFlight).toHaveBeenCalledWith(mockFlight, expect.any(Date));
      expect(result).toEqual(updatedFlight);
    });
  });

  describe('getUserFlights', () => {
    it('throws error if userId is missing', async () => {
      await expect(airlineService.getUserFlights('')).rejects.toThrow('User ID is required');
    });

    it('returns empty array when no flights found', async () => {
      airlineRepository.findFlightsByUserId.mockResolvedValue([]);
      const result = await airlineService.getUserFlights('user123');
      expect(result).toEqual([]);
    });

    it('returns flights for user', async () => {
      const mockFlights = [
        createMockFlight(),
        createMockFlight({ id: 2, departureDate: new Date('2024-03-21') })
      ];
      airlineRepository.findFlightsByUserId.mockResolvedValue(mockFlights);

      const result = await airlineService.getUserFlights('user123');

      expect(airlineRepository.findFlightsByUserId).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockFlights);
    });
  });
}); 