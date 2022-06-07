defmodule Chat.PrivateRooms.PrivateRoom do
  use Ecto.Schema
  import Ecto.Changeset

  schema "privaterooms" do
    field :owner, :string
    field :room_id, Ecto.UUID
    field :invitees, {:array, :string}
    field :topic, :string

    timestamps()
  end

  @doc false
  def changeset(private_room, attrs) do
    private_room
    |> cast(attrs, [:owner, :room_id, :invitees, :topic])
    |> validate_required([:owner, :room_id])
  end
end
