defmodule Chat.PrivateRooms do
  import Ecto.Query, warn: false

  alias Chat.Repo
  alias Chat.PrivateRooms.PrivateRoom

  def get_private_room(room_id_string) do
    with {:ok, room_id} <- Ecto.UUID.cast(room_id_string) do
      Repo.get_by(PrivateRoom, room_id: room_id)
    end
  end

  def get_room_by_code(invite_code) do
    Repo.get_by(PrivateRoom, shareable_code: invite_code)
  end

  def add_user_to_room(room, username) do
    room
    |> Ecto.Changeset.change()
    |> Ecto.Changeset.put_change(:invitees, [username | room.invitees ])
    |> Repo.update()
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

  def update_topic(room, new_topic) do 
    room
    |> PrivateRoom.update_topic_changeset(%{topic: new_topic})
    |> Repo.update!()
  end

  def is_owner?(%PrivateRoom{owner: owner}, username) do 
    owner == username 
  end

  defp generate_code(length \\ 16) do
    length
    |> :crypto.strong_rand_bytes()
    |> Base.url_encode64()
    |> binary_part(0, length)
  end

end
