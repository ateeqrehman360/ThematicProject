Send friend request

const { data, error } = await supabase
  .from('friend_requests')
  .insert({
    sender_id: currentUserId,
    receiver_id: targetUserId
  })
  .select()
  .single()


Get incoming pending requests

const { data, error } = await supabase
  .from('friend_requests')
  .select(`
    id,
    sender_id,
    receiver_id,
    status,
    created_at,
    sender:profiles!friend_requests_sender_id_fkey (
      id,
      username,
      bio,
      city,
      area,
      tcg_interests
    )
  `)
  .eq('receiver_id', currentUserId)
  .eq('status', 'pending')


Get outgoing pending requests

const { data, error } = await supabase
  .from('friend_requests')
  .select(`
    id,
    sender_id,
    receiver_id,
    status,
    created_at,
    receiver:profiles!friend_requests_receiver_id_fkey (
      id,
      username,
      bio,
      city,
      area,
      tcg_interests
    )
  `)
  .eq('sender_id', currentUserId)
  .eq('status', 'pending')


Accept friend request

const { error } = await supabase.rpc('accept_friend_request', {
  request_id: requestId
})


Reject friend request

const { error } = await supabase.rpc('reject_friend_request', {
  request_id: requestId
})


Get friends list

const { data, error } = await supabase
  .from('friendships')
  .select(`
    user1_id,
    user2_id
  `)
  .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
