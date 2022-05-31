defmodule Chat.PrivateRooms.PrivateRoom do
  use Ecto.Schema
  import Ecto.Changeset

  schema "privaterooms" do
    field :owner, :string
    field :room_id, Ecto.UUID
    field :invitees, {:array, :string}

    timestamps()
  end

  @doc false
  def changeset(private_room, attrs) do
    IO.inspect(attrs, label: "ATTRS")
    private_room
    |> cast(attrs, [:owner, :room_id, :invitees])
    |> validate_required([:owner])
  end
end
