defmodule Chat.Repo.Migrations.CreatePrivaterooms do
  use Ecto.Migration

  def change do
    create table(:privaterooms) do
      add :owner, :string
      add :room_id, :uuid
      add :invitees, {:array, :string}
      add :topic, :string

      timestamps()
    end
  end
end
