defmodule ChatWeb.LobbyChannel do
  use Phoenix.Channel
  alias ChatWeb.LobbyPresence
  alias Chat.PrivateRooms

  def join("rooms:lobby", params, socket) do
    IO.inspect(params, label: "Params: ")
    send(self(), :after_join)
    {:ok, assign(socket, username: params["username"], color: params["color"])}
  end

  def join("rooms:" <> room_id, params, socket) do
    username = params["username"]

    if PrivateRooms.is_user_invited?(username, room_id) do
      send(self(), :after_join_private_room)
      {:ok, assign(socket, username: username, color: params["color"])}
    else
      {:error, "not invited"}
    end
  end

  def join("users:" <> _username, _params, socket) do
    IO.inspect(socket.assigns, label: "JOINING OWN CHANNEL")
    {:ok, socket}
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
    {:ok, _} =
      LobbyPresence.track(socket, socket.assigns.username, %{
        username: socket.assigns.username,
        color: socket.assigns.color
      })

    push(socket, "presence_state", LobbyPresence.list(socket))
    {:noreply, socket}
  end

  def handle_in("submit_message", payload, socket) do
    broadcast!(socket, "new_message", payload)
    {:noreply, socket}
  end

  def handle_in("private_room_closed" = event_name, payload, socket) do
    broadcast!(socket, event_name, payload)
    PrivateRooms.delete_private_room(payload["room_id"])
    {:noreply, socket}
  end

  def handle_in("kick_user" = event_name, payload, socket) do
    broadcast!(socket, event_name, payload)
    PrivateRooms.remove_user_from_invite_list(payload["room_id"], payload["username"])
    {:noreply, socket}
  end

  def terminate(reason, _socket) do
    IO.inspect(reason, label: "Terminate reason")
  end
end
