import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable() // Marks the class as a provider that can be injected into other classes
export class RolesGuard implements CanActivate {
    // Implements the CanActivate interface for route guards
    constructor(private reflector: Reflector) {} // Injects the Reflector service to access metadata

    canActivate(context: ExecutionContext): boolean {
        // Main method to determine if the request can proceed
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [
                // Retrieves roles metadata
                context.getHandler(), // From the handler (method) level
                context.getClass(), // And from the class level
            ],
        );

        if (!requiredRoles) return true; // If no roles are required, allow access

        const request = context.switchToHttp().getRequest(); // Gets the HTTP request object

        const user = request.user; // Accesses the user object set by authentication middleware

        return matchRoles(requiredRoles, user?.role); // Checks if user roles match the required roles
    }
}

function matchRoles(requiredRoles: string[], userRole: string[]): boolean {
    // Helper function to match roles
    return requiredRoles.some((role: string) => userRole?.includes(role)); // Returns true if any required role is found in user roles
}
