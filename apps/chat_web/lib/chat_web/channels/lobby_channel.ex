defmodule ChatWeb.LobbyChannel do
  use Phoenix.Channel
  alias ChatWeb.LobbyPresence

  def join("rooms:lobby", params, socket) do
    IO.inspect(params, label: "Params: ")
    send(self(), :after_join)
    {:ok, assign(socket, username: params["username"], color: params["color"])}
  end

  def join("rooms:" <> _roomId, params, socket) do
    IO.inspect(params, label: "Private Room Params: ")
    send(self(), :after_join_private_room)
    {:ok, assign(socket, username: params["username"], color: params["color"])}
  end

  def handle_info(:after_join, socket) do
    IO.inspect(socket.assigns, label: "Socket Assigns")

    {:ok, _} =
      LobbyPresence.track(socket, socket.assigns.username, %{
        username: socket.assigns.username,
        online_at: inspect(System.system_time(:second)),
        color: socket.assigns.color
      })

    push(socket, "presence_state", LobbyPresence.list(socket))
    {:noreply, socket}
  end

  def handle_info(:after_join_private_room, socket) do
    {:noreply, socket}
  end

  def handle_in("submit_message", payload, socket) do
    broadcast!(socket, "new_message", payload)
    {:noreply, socket}
  end
end
