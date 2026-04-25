"use client";

import Button from '@/components/Button'
import { createClient } from '@/utils/supabse';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const page = () => {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Logged out successfully!");
        router.push("/login");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button

                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    )
}

export default page