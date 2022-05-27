defmodule Chat.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Chat.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Chat.PubSub},
      ChatWeb.LobbyPresence
      # Start a worker by calling: Chat.Worker.start_link(arg)
      # {Chat.Worker, arg}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Chat.Supervisor)
  end
end
