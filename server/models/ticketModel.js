const Ticket = require("./Ticket");

exports.createTicket = async (user, business, message) => {
  return await Ticket.create({
    user,
    business,
    message,
  });
};

exports.getAllTickets = async (business, user) => {
  const filter = {};

  if (business) {
    filter.business = business;
  }

  if (user) {
    filter.user = user;
  }

  return await Ticket.find(filter)
    .populate("user")
    .populate("business")
    .sort({ created_at: 1 });
};

exports.startTicket = async (id) => {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    return null;
  }

  if (ticket.status !== "waiting") {
    return {
      error: true,
      message: "Only waiting tickets can be started",
    };
  }

  await Ticket.updateMany(
    {
      business: ticket.business,
      status: "active",
    },
    {
      status: "waiting",
    }
  );

  return await Ticket.findByIdAndUpdate(
    id,
    { status: "active" },
    { new: true }
  )
    .populate("user")
    .populate("business");
};

exports.doneTicket = async (id) => {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    return null;
  }

  if (ticket.status !== "active") {
    return {
      error: true,
      message: "Only active tickets can be completed",
    };
  }

  return await Ticket.findByIdAndUpdate(
    id,
    {
      status: "done",
      completed_at: new Date(),
    },
    { new: true }
  )
    .populate("user")
    .populate("business");
};