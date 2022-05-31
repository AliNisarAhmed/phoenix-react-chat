defmodule Chat.PrivateRooms do
  import Ecto.Query, warn: false

  alias Chat.Repo
  alias Chat.PrivateRooms.PrivateRoom

  def create_private_room(attrs \\ %{}) do
    attrs = Map.put(attrs, "room_id", Ecto.UUID.generate())

    resp =
      %PrivateRoom{}
      |> PrivateRoom.changeset(attrs)
      |> IO.inspect(label: "Before Ecto")
      |> Repo.insert()

    resp
  end
end
