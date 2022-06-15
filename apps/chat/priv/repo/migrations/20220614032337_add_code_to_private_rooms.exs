defmodule Chat.Repo.Migrations.AddCodeToPrivateRooms do
  use Ecto.Migration

  def change do
    alter table("privaterooms") do
      add :shareable_code, :text, null: false
    end

    create unique_index("privaterooms", [:shareable_code])
  end
end
