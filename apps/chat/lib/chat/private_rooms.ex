defmodule Chat.PrivateRooms do
  import Ecto.Query, warn: false

  alias Chat.Repo
  alias Chat.PrivateRooms.PrivateRoom

  def get_private_room(room_id_string) do
    with {:ok, room_id} <- Ecto.UUID.cast(room_id_string) do
      Repo.get_by(PrivateRoom, room_id: room_id)
    end
  end

  def create_private_room(attrs \\ %{}) do
    attrs =
      attrs
      |> Map.put("room_id", Ecto.UUID.generate())
      |> Map.put("shareable_code", generate_code())

    resp =
      %PrivateRoom{}
      |> PrivateRoom.changeset(attrs)
      |> Repo.insert()

    resp
  end

  def delete_private_room(room_id_string) do
    with {:ok, room_id} <- Ecto.UUID.cast(room_id_string) do
      from(x in PrivateRoom, where: x.room_id == ^room_id)
      |> Repo.delete_all()
    end
  end

  def remove_user_from_invite_list(room_id_string, username) do
    with {:ok, room_id} <- Ecto.UUID.cast(room_id_string),
         room when not is_nil(room) <- Repo.get_by(PrivateRoom, room_id: room_id) do
      new_invite_list =
        room.invitees
        |> Enum.filter(&(&1 != username))

      changeset = PrivateRoom.changeset(room, %{invitees: new_invite_list})

      Repo.update!(changeset)
    end
  end

  def is_user_invited?(username, room_id_string) do
    IO.inspect(username, label: "Inside is_user_invited?")

    with {:ok, room_id} <- Ecto.UUID.cast(room_id_string),
         room when not is_nil(room) <- Repo.get_by(PrivateRoom, room_id: room_id) do
      is_invited?(username, room)
    else
      _ -> false
    end
  end

  def is_invited?(username, room) do
    room.owner == username or Enum.member?(room.invitees, username)
  end

  defp generate_code(length \\ 16) do
    length
    |> :crypto.strong_rand_bytes()
    |> Base.encode64()
    |> binary_part(0, length)
  end
end
