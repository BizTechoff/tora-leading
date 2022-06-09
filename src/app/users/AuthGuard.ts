import { Injectable } from '@angular/core';
import { AuthenticatedGuard } from '@remult/angular';
import { Roles } from './roles';


@Injectable()
export class AdminGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.admin;
    }
}

@Injectable()
export class ManagerGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.manager;
    }
}

@Injectable()
export class ShluchGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.shluch;
    }
}

@Injectable()
export class AvrechGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.avrech;
    }
}

@Injectable()
export class ManagerOrAdminGuard extends AuthenticatedGuard {

    override isAllowed() {
        return this.remult.isAllowed([Roles.admin, Roles.manager]);
    }
}
