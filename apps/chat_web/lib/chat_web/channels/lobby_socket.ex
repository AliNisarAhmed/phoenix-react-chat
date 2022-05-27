defmodule ChatWeb.LobbySocket do
  use Phoenix.Socket

  channel "rooms:*", ChatWeb.LobbyChannel

  def connect(_params, socket) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
