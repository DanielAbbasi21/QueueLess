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

  const tickets = await Ticket.find(filter)
    .populate("user", "-password")
    .populate("business")
    .sort({ created_at: 1 });

  const allWaitingTickets = await Ticket.find({ status: "waiting" })
    .sort({ created_at: 1 });

  return tickets.map((ticket) => {
    const ticketObject = ticket.toObject();

    if (ticket.status === "active") {
      ticketObject.queuePosition = 0;
      return ticketObject;
    }

    if (ticket.status === "done") {
      ticketObject.queuePosition = null;
      return ticketObject;
    }

    const waitingTicketsForBusiness = allWaitingTickets.filter(
      (waitingTicket) =>
        waitingTicket.business.toString() === ticket.business._id.toString()
    );

    const position = waitingTicketsForBusiness.findIndex(
      (waitingTicket) => waitingTicket._id.toString() === ticket._id.toString()
    );

    ticketObject.queuePosition = position + 1;

    return ticketObject;
  });
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
    { 
      status: "active",
      started_at: new Date()
    },
    { new: true }
  )
    .populate("user", "-password")
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
    .populate("user", "-password")
    .populate("business");
};