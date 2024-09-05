import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { TokenService } from "src/app/services/token.service";

export const RequireAuthGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const tokenService = inject(TokenService);

    if(!auth.isAuthenticated()) {
        tokenService.clearToken();
        router.navigateByUrl('/login')
        return false
    }
    return true
}

export const PreventAuthAccessGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if(auth.isAuthenticated()) {
        router.navigateByUrl('/articles')
        return false
    }
    return true
}