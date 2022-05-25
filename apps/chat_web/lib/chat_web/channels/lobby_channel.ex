defmodule ChatWeb.LobbyChannel do
  use Phoenix.Channel

  def join("rooms:lobby", _message, socket) do
    IO.inspect(socket, label: "JOined channel")
    send(self(), :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    push(socket, "welcome", %{message: "Welcome to lobby"})
    {:noreply, socket}
  end
end
