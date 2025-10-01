<template>
<div>Halaman Admin: {{ user?.role }}</div>
<div>
    <button @click="logout">Logout</button>
</div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient();

async function logout() {
    await supabase.auth.signOut()
}

</script>