defmodule ChatWeb.PrivateRoomView do
  use ChatWeb, :view

  def render("create.json", %{room: room}) do
    %{room_id: room.room_id}
  end
end
