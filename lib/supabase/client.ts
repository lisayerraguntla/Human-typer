export function createClient() {
  return {
    auth: {
      signUp: async (options: any) => {
        console.log("[v0] Mock signUp:", options.email)
        return { data: { user: null }, error: null }
      },
      signInWithPassword: async (credentials: any) => {
        console.log("[v0] Mock signIn:", credentials.email)
        return { data: { user: { id: "1", email: credentials.email } }, error: null }
      },
      signOut: async () => {
        console.log("[v0] Mock signOut")
        return { error: null }
      },
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
