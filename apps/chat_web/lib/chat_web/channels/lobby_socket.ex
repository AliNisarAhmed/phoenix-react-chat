defmodule ChatWeb.LobbySocket do
  use Phoenix.Socket

  channel "rooms:*", ChatWeb.LobbyChannel

  def connect(_params, socket) do
    IO.inspect(socket, label: "SOCKET")
    {:ok, socket}
  end

  def id(_socket), do: nil
end
