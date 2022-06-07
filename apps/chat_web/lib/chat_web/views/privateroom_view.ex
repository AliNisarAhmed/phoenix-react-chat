defmodule ChatWeb.PrivateRoomView do
  use ChatWeb, :view

  def render("create.json", %{room: room}) do
    %{room_id: room.room_id, owner: room.owner, topic: room.topic}
  end
end
