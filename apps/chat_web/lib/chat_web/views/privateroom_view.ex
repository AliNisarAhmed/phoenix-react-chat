defmodule ChatWeb.PrivateRoomView do
  use ChatWeb, :view

  def render("index.json", %{room: room, is_owner: true}) do
    %{
      room_id: room.room_id,
      owner: room.owner,
      topic: room.topic,
      sharable_code: room.shareable_code
    }
  end

  def render("index.json", %{room: room, is_owner: false}) do
    %{room_id: room.room_id, owner: room.owner, topic: room.topic}
  end

  def render("create.json", %{room: room}) do
    %{
      room_id: room.room_id,
      owner: room.owner,
      topic: room.topic,
      shareable_code: room.shareable_code
    }
  end
end
