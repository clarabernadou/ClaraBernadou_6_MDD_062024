import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

export const RequireAuthGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if(!auth.isAuthenticated()) {
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