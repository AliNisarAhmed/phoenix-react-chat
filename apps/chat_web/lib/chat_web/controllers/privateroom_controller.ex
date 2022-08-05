defmodule ChatWeb.PrivateRoomController do
  use ChatWeb, :controller

  alias Chat.PrivateRooms

  action_fallback ChatWeb.FallbackController

  def index(conn, %{"room_id" => room_id, "username" => username}) do
    with room <- PrivateRooms.get_private_room(room_id),
         true <- PrivateRooms.is_invited?(username, room) do
      render(conn, "index.json", %{room: room, is_owner: room.owner == username})
    else
      false -> {:error, :unauthorized}
      _ -> {:error, :not_found}
    end
  end

  def create(conn, params) do
    with {:ok, room} <- PrivateRooms.create_private_room(params) do
      IO.inspect(room, label: "CREATED ROOM")

      for username <- room.invitees do
        ChatWeb.Endpoint.broadcast!("users:" <> username, "invitation", %{
          room_id: room.room_id,
          owner: room.owner,
          topic: room.topic
        })
      end

      render(conn, "create.json", %{room: room})
    end
  end

  def accept_invite(conn, %{"username" => username, "invite_code" => invite_code}) do
    with room when not is_nil(room) <- PrivateRooms.get_room_by_code(invite_code) do
      if not Enum.member?(room.invitees, username) do
        PrivateRooms.add_user_to_room(room, username)
      end

      render(conn, "create.json", %{room: room})
    else
      nil -> {:error, :not_found}
      _ -> {:error, :unknown}
    end
  end

  def update_topic(conn, %{"room_id" => room_id, "new_topic" => new_topic, "username" => username}) do
    with room when not is_nil(room) <- PrivateRooms.get_private_room(room_id), 
        true <- PrivateRooms.is_owner?(room, username) do
      updated_room = PrivateRooms.update_topic(room, new_topic)

      ChatWeb.Endpoint.broadcast!("rooms:" <> room_id, "topic_updated", %{
        new_topic: updated_room.topic,
        message: %{text: "#{updated_room.owner} updated the room topic"}
      })

      render(conn, "create.json", %{room: updated_room})
    else 
      false -> {:error, :not_authorized}
      _ -> {:error, :not_found}
    end
  end
end
