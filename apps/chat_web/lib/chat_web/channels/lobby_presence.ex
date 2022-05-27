defmodule ChatWeb.LobbyPresence do
  use Phoenix.Presence,
    otp_app: :chat_web,
    pubsub_server: Chat.PubSub

end
