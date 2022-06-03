defmodule Chat.PrivateRooms do
  import Ecto.Query, warn: false

  alias Chat.Repo
  alias Chat.PrivateRooms.PrivateRoom

  def create_private_room(attrs \\ %{}) do
    attrs = Map.put(attrs, "room_id", Ecto.UUID.generate())

    resp =
      %PrivateRoom{}
      |> PrivateRoom.changeset(attrs)
      |> Repo.insert()

    resp
  end

  def is_user_invited?(username, room_id_string) do
    with {:ok, room_id} <- Ecto.UUID.cast(room_id_string),
         room when not is_nil(room) <- Repo.get_by(PrivateRoom, room_id: room_id) do
      room.owner == username or Enum.member?(room.invitees, username)
    else
      _ -> false
    end
  end
end
