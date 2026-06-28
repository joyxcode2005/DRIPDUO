import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';


// Load environment variables from .env
dotenv.config({
    path: path.resolve(process.cwd(), '.env.local'),
});

// Init Supabase with service role key
// SECURITY FIX: NEXT_PUBLIC_ removed from the service role key!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Service Role Key:', supabaseServiceRoleKey);

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Supabase URL or Service Role Key is missing in environment variables.');
    process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});

// Define the function to seed the admin user
async function seedAdmin() {
    const adminEmail = "coder.joy2005@gmail.com"; // Add your email here
    const adminPassword = "joy.admin@2005"; // Add your password here
    const fullname = "Joy Sengupta"; // Add your full name here
    const phone = "6289666500"; // Add your phone number here

    console.log(`Attempting to seed the admin user with email: ${adminEmail}`);

    try {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
            user_metadata: {
                role: 'ADMIN',
                phone: phone,
                fullname: fullname
            },
        });


        console.log('Supabase auth response:', authData);

        if (authError) {
            console.error('❌ Error creating admin user:', authError);
            console.error('❌ Error seeding admin user:', authError.message);
        } else {
            // Using optional chaining just to be perfectly type-safe with the Supabase response
            console.log('✅ Admin user seeded successfully! User ID:', authData?.user?.id);
        }

    } catch (error) {
        // TypeScript Fix: Safely handling the 'unknown' error type
        if (error instanceof Error) {
            console.error('Unexpected error:', error.message);
        } else {
            console.error('Unexpected error:', String(error));
        }
    }
}

seedAdmin();