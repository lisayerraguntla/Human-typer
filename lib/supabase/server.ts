export async function createClient() {
  return {
    auth: {
      getUser: async () => {
        return { data: { user: null }, error: null }
      },
      getSession: async () => {
        return { data: { session: null }, error: null }
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
  }
}
