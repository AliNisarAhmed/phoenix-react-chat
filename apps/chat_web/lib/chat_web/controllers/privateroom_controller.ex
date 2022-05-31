defmodule ChatWeb.PrivateRoomController do
  use ChatWeb, :controller

  alias Chat.PrivateRooms

  def create(conn, params) do
    with {:ok, room} <- PrivateRooms.create_private_room(params) do
      render(conn, "create.json", %{room: room})
    end
  end
end
