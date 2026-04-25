"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var supabase_js_1 = require("@supabase/supabase-js");
var win32_1 = require("path/win32");
// Load environment variables from .env
dotenv.config({
    path: win32_1.default.resolve(process.cwd(), '.env.local'),
});
// Init Supabase with service role key
// SECURITY FIX: NEXT_PUBLIC_ removed from the service role key!
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Service Role Key:', supabaseServiceRoleKey);
if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase URL or Service Role Key is missing in environment variables.');
    process.exit(1);
}
// Create a Supabase client with the service role key
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
// Define the function to seed the admin user
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var adminEmail, adminPassword, fullname, phone, _a, authData, authError, dbError, error_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    adminEmail = "joysengupta252005@gmail.com";
                    adminPassword = "joy.admin@2005";
                    fullname = "Joy Sengupta";
                    phone = "8777699459";
                    console.log("Attempting to seed the admin user with email: ".concat(adminEmail));
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, supabase.auth.admin.createUser({
                            email: adminEmail,
                            password: adminPassword,
                            email_confirm: true,
                            user_metadata: {
                                role: 'ADMIN',
                            },
                        })];
                case 2:
                    _a = _c.sent(), authData = _a.data, authError = _a.error;
                    if (authError) {
                        console.error('❌ Error seeding admin user:', authError.message);
                    }
                    else {
                        // Using optional chaining just to be perfectly type-safe with the Supabase response
                        console.log('✅ Admin user seeded successfully! User ID:', (_b = authData === null || authData === void 0 ? void 0 : authData.user) === null || _b === void 0 ? void 0 : _b.id);
                    }
                    if (!(authData === null || authData === void 0 ? void 0 : authData.user)) return [3 /*break*/, 4];
                    return [4 /*yield*/, supabase
                            .from('users')
                            .insert({
                            id: authData.user.id, // Crucial: Link the public profile to the auth UUID
                            email: adminEmail,
                            fullname: fullname,
                            phone: phone,
                            role: 'ADMIN' // Assuming you have a role column in your public table
                        })];
                case 3:
                    dbError = (_c.sent()).error;
                    if (dbError) {
                        console.error('❌ Error inserting into public.users table:', dbError.message);
                    }
                    else {
                        console.log('✅ User profile successfully added to the public.users table!');
                    }
                    _c.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _c.sent();
                    // TypeScript Fix: Safely handling the 'unknown' error type
                    if (error_1 instanceof Error) {
                        console.error('Unexpected error:', error_1.message);
                    }
                    else {
                        console.error('Unexpected error:', String(error_1));
                    }
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
seedAdmin();
