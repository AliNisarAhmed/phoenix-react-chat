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

  def handle_in("submit_message", payload, socket) do
    broadcast!(socket, "new_message", payload)
    {:noreply, socket}
  end
end
