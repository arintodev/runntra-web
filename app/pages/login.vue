<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const supabase = useSupabaseClient();
const toast = useToast();

const fields = ref([
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  }, {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password',
    required: true
  }
])

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function signInWithEmail(payload: FormSubmitEvent<Schema>) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password,
  })

  if (error) {
    toast.add({
      title: "Login Failed",
      description: error.message,
      color: "error"
    })
  }
}

</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 my-6">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        class="max-w-md"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="signInWithEmail"
      />
    </UPageCard>
  </div>
</template>
