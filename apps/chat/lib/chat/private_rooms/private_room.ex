defmodule Chat.PrivateRooms.PrivateRoom do
  use Ecto.Schema
  import Ecto.Changeset

  schema "privaterooms" do
    field :owner, :string
    field :room_id, Ecto.UUID
    field :invitees, {:array, :string}
    field :topic, :string
    field :shareable_code, :string

    timestamps()
  end

  @doc false
  def changeset(private_room, attrs) do
    private_room
    |> cast(attrs, [:owner, :room_id, :invitees, :topic, :shareable_code])
    |> validate_required([:owner, :room_id, :shareable_code])
  end

  def update_topic_changeset(private_room, attrs) do 
    private_room 
    |> cast(attrs, [:topic])
    |> validate_required([:topic])
  end
end
