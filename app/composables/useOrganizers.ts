import { ref } from 'vue'

type Organizer = {
  id: string
  name: string
  event_count: number
}

export const useOrganizers = () => {
  const organizers = ref<Organizer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchOrganizers = async () => {
    const supabase = useSupabaseClient()
    isLoading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('organizers')
        .select()

      if (supabaseError) {
        throw supabaseError
      }

      organizers.value = data || []
    } catch (e: any) {
      error.value = e.message
      const toast = useToast()
      toast.add({
        color: 'error',
        title: 'Fetch organizers failed',
        description: e.message
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    organizers,
    isLoading,
    error,
    fetchOrganizers
  }
}