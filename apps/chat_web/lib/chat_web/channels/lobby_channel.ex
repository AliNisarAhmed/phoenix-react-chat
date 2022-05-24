defmodule ChatWeb.LobbyChannel do
  use Phoenix.Channel

  def join("lobby", _message, socket) do
    {:ok, socket}
  end

end
