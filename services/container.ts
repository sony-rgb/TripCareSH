import { IUserService } from "./interfaces/IUserService";
import { ITripService } from "./interfaces/ITripService";
import { IAirlineService } from "./interfaces/IAirlineService";
import { IEmailVerificationService } from "./interfaces/IEmailVerificationService";
import { IAuthService } from "./interfaces/IAuthService";
import { ISyncService } from "./interfaces/ISyncService";
import { IFlightService } from "./interfaces/IFlightService";
import { ITripItemService } from "./interfaces/ITripItemService";
import { IActivityItemService } from "./interfaces/IActivityItemService";

type ServiceFactory<T> = () => T;

class Container {
  private singletons = new Map<string, any>();
  private factories = new Map<string, ServiceFactory<any>>();

  constructor() {
    this.registerFactories();
  }

  private registerFactories() {
    // Repository registrations
    this.factories.set('TripRepository', () => new (require('../repositories/TripRepository').default)());
    this.factories.set('AirlineRepository', () => new (require('../repositories/AirlineRepository').default)());
    this.factories.set('FlightRepository', () => new (require('../repositories/FlightRepository').default)());
    this.factories.set('TripItemRepository', () => new (require('../repositories/TripItemRepository').default)());
    this.factories.set('ActivityItemRepository', () => new (require('../repositories/ActivityItemRepository').default)());

    // Service registrations with dependency injection
    this.factories.set('FlightService', () => {
      const { FlightService } = require('./FlightService');
      const tripItemRepository = this.resolve('TripItemRepository');
      const flightRepository = this.resolve('FlightRepository');
      return new FlightService(tripItemRepository, flightRepository);
    });

    this.factories.set('ActivityItemService', () => {
      const { ActivityItemService } = require('./ActivityItemService');
      const tripItemRepository = this.resolve('TripItemRepository');
      const activityItemRepository = this.resolve('ActivityItemRepository');
      return new ActivityItemService(tripItemRepository, activityItemRepository);
    });
    
    this.factories.set('TripItemService', () => {
      const { TripItemService } = require('./TripItemService');
      const tripItemRepository = this.resolve('TripItemRepository');
      const activityRepository = this.resolve('ActivityItemRepository');
      const flightRepository = this.resolve('FlightRepository');
      return new TripItemService(tripItemRepository, activityRepository, flightRepository);
    });
    this.factories.set('EmailVerificationService', () => {
      const { EmailVerificationService } = require('./EmailVerificationService');
      return new EmailVerificationService();
    });

    this.factories.set('AuthService', () => {
      const AuthService = require('./AuthService').default;
      return AuthService; // Return the singleton instance, don't create new
    });

    this.factories.set('UserRepository', () => new (require('../repositories/UserRepository').default)());

    this.factories.set('UserService', () => {
      const { UserService } = require('./UserService');
      const emailVerificationService = this.resolve<IEmailVerificationService>('EmailVerificationService');
      const userRepository = this.resolve('UserRepository');
      const authService = this.resolve<IAuthService>('AuthService');
      return new UserService(emailVerificationService, userRepository, authService);
    });

    this.factories.set('TripService', () => {
      const { TripService } = require('./TripService');
      const tripRepository = this.resolve('TripRepository');
      const authService = this.resolve<IAuthService>('AuthService');
      return new TripService(tripRepository, authService);
    });

    this.factories.set('AirlineService', () => {
      const { AirlineService } = require('./AirlineService');
      const airlineRepository = this.resolve('AirlineRepository');
      return new AirlineService(airlineRepository);
    });

    this.factories.set('SyncService', () => {
      const SyncService = require('../database/SyncService').SyncService;
      const authService = this.resolve<IAuthService>('AuthService');
      return new SyncService(authService);
    });
  }

  resolve<T>(serviceName: string): T {
    // Return existing singleton if available
    if (this.singletons.has(serviceName)) {
      return this.singletons.get(serviceName);
    }

    // Create new instance using factory
    const factory = this.factories.get(serviceName);
    if (!factory) {
      throw new Error(`Service '${serviceName}' not registered`);
    }

    const instance = factory();
    this.singletons.set(serviceName, instance);
    return instance;
  }

  // Convenience methods for type safety
  getTripRepository() {
    return this.resolve('TripRepository');
  }

  getAirlineRepository() {
    return this.resolve('AirlineRepository');
  }

  getFlightRepository() {
    return this.resolve('FlightRepository');
  }

  getTripItemRepository() {
    return this.resolve('TripItemRepository');
  }

  getActivityItemRepository() {
    return this.resolve('ActivityItemRepository');
  }

  getUserRepository() {
    return this.resolve('UserRepository');
  }

  getTripService(): ITripService {
    return this.resolve<ITripService>('TripService');
  }

  getAirlineService(): IAirlineService {
    return this.resolve<IAirlineService>('AirlineService');
  }

  getUserService(): IUserService {
    return this.resolve<IUserService>('UserService');
  }

  getEmailVerificationService(): IEmailVerificationService {
    return this.resolve<IEmailVerificationService>('EmailVerificationService');
  }

  getAuthService(): IAuthService {
    return this.resolve<IAuthService>('AuthService');
  }

  getSyncService(): ISyncService {
    return this.resolve<ISyncService>('SyncService');
  }

  getFlightService(): IFlightService {
    return this.resolve<IFlightService>('FlightService');
  }

  getTripItemService(): ITripItemService {
    return this.resolve<ITripItemService>('TripItemService');
  }

  getActivityItemService(): IActivityItemService {
    return this.resolve<IActivityItemService>('ActivityItemService');
  }
}

export const container = new Container();
