import { supabase } from "../lib/supabaseClient.js"

export async function discoverProfiles(userId, limit = 20, offset = 0) {
  const { data: blockedByMe } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", userId)

  const { data: blockedMe } = await supabase
    .from("blocks")
    .select("blocker_id")
    .eq("blocked_id", userId)

  const excludedIds = [
    userId,
    ...(blockedByMe || []).map((b) => b.blocked_id),
    ...(blockedMe || []).map((b) => b.blocker_id),
  ]

  const { data: myInterests } = await supabase
    .from("user_interests")
    .select("interest")
    .eq("user_id", userId)

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("favourite_tcg")
    .eq("id", userId)
    .single()

  const myInterestList = (myInterests || []).map((i) => i.interest)
  const myFavTcg = myProfile?.favourite_tcg || null

  const { data: candidates, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      display_name,
      bio,
      favourite_tcg,
      created_at,
      user_interests (interest)
    `)
    .not("id", "in", `(${excludedIds.join(",")})`)
    .eq("is_private", false)
    .range(offset, offset + limit - 1)

  if (error) return { success: false, data: null, error: error.message }

  const scored = (candidates || [])
    .map((profile) => {
      const theirInterests = (profile.user_interests || []).map((i) => i.interest)
      const sharedInterestCount = theirInterests.filter((i) => myInterestList.includes(i)).length
      const tcgMatch = myFavTcg && profile.favourite_tcg === myFavTcg ? 1 : 0
      return {
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        favourite_tcg: profile.favourite_tcg,
        created_at: profile.created_at,
        shared_interest_count: sharedInterestCount,
        tcg_match: tcgMatch,
      }
    })
    .sort((a, b) => {
      if (b.shared_interest_count !== a.shared_interest_count)
        return b.shared_interest_count - a.shared_interest_count
      if (b.tcg_match !== a.tcg_match)
        return b.tcg_match - a.tcg_match
      return new Date(b.created_at) - new Date(a.created_at)
    })

  return { success: true, data: scored, error: null }
}
