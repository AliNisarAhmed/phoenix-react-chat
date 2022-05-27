defmodule ChatWeb.LobbyChannel do
  use Phoenix.Channel
  alias ChatWeb.LobbyPresence

  def join("rooms:lobby", params, socket) do
    IO.inspect(params, label: "Params: ")
    send(self(), :after_join)
    {:ok, assign(socket, username: params["username"])}
  end

  def handle_info(:after_join, socket) do
    {:ok, _} =
      LobbyPresence.track(socket, socket.assigns.username, %{
        username: socket.assigns.username,
        online_at: inspect(System.system_time(:second))
      })

    push(socket, "presence_state", LobbyPresence.list(socket))
    {:noreply, socket}
  end

  def handle_in("submit_message", payload, socket) do
    broadcast!(socket, "new_message", payload)
    {:noreply, socket}
  end
end
