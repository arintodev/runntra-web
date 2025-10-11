<template>
    <UDropdownMenu v-if="user" :items="userMenu" :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8
    }">
        <UUser :avatar="{
            src: 'https://i.pravatar.cc/150?u=john-doe',
            icon: 'i-lucide-image'
        }" />
        <template #content-top>
            <div class="p-2">
                <UUser name="John Doe" :description="user?.email" :avatar="{
                    src: 'https://i.pravatar.cc/150?u=john-doe',
                    icon: 'i-lucide-image'
                }" />
            </div>
            <USeparator />
        </template>
    </UDropdownMenu>
    <UButton variant="outline" v-else label="Sign in" to="/login" />
</template>
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const toast = useToast()
const router = useRouter()

async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        toast.add({
            color: 'error',
            title: 'Logout failed'
        })
        return
    }

    toast.add({
        title: 'You are logged out'
    })

    router.replace('/')
}

const userMenu = ref<DropdownMenuItem[][]>([
    [
        {
            label: 'Profile',
            icon: 'i-lucide-user'
        },
        {
            label: 'Races',
            icon: 'i-lucide-medal',
            to: '/my-races'
        },
        {
            label: 'Events',
            icon: 'i-lucide-calendar-1',
            to: '/my-events'
        },
        {
            label: 'Organizers',
            icon: 'i-lucide-boxes',
            to: '/organizers'
        },
    ],
    [
        {
            label: 'Log out',
            type: 'link',
            onSelect: logout
        }
    ]
])
</script>