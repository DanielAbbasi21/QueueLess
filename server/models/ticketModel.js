const Ticket = require("./Ticket");

exports.createTicket = async (user, business, message) => {
  return await Ticket.create({
    user,
    business,
    message,
  });
};

const getAverageServiceTime = async (businessId) => {
  const completedTickets = await Ticket.find({
    business: businessId,
    status: "done",
    started_at: { $exists: true },
    completed_at: { $exists: true },
  });

  if (completedTickets.length === 0) {
    return 5;
  }

  const totalMinutes = completedTickets.reduce((sum, ticket) => {
    const started = new Date(ticket.started_at);
    const completed = new Date(ticket.completed_at);

    const diffMinutes = (completed - started) / 1000 / 60;

    return sum + diffMinutes;
  }, 0);

  return Math.ceil(totalMinutes / completedTickets.length);
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

  return await Promise.all(
    tickets.map(async (ticket) => {
    const ticketObject = ticket.toObject();

      if (ticket.status === "active") {
        ticketObject.queuePosition = 0;
        ticketObject.estimatedWaitTime = 0;
        return ticketObject;
      }

      if (ticket.status === "done") {
        ticketObject.queuePosition = null;
        ticketObject.estimatedWaitTime = null;
        return ticketObject;
      }

      if (ticket.status === "cancelled") {
        ticketObject.queuePosition = null;
        ticketObject.estimatedWaitTime = null;
        return ticketObject;
      }

      if (ticket.status === "blocked") {
        ticketObject.queuePosition = null;
        ticketObject.estimatedWaitTime = null;
        return ticketObject;
      }

      const waitingTicketsForBusiness = allWaitingTickets.filter(
        (waitingTicket) =>
          waitingTicket.business.toString() === ticket.business._id.toString()
      );

      const position = waitingTicketsForBusiness.findIndex(
        (waitingTicket) => waitingTicket._id.toString() === ticket._id.toString()
      );

      const queuePosition = position + 1;
      const averageServiceTime = await getAverageServiceTime(ticket.business._id);

      ticketObject.queuePosition = queuePosition;
      ticketObject.estimatedWaitTime = queuePosition * averageServiceTime;

      return ticketObject;
    })
  );
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

exports.cancelTicket = async (id, reason, cancelledBy) => {
  return await Ticket.findByIdAndUpdate(
    id,
    {
      status: "cancelled",
      cancelled_at: new Date(),
      cancelled_reason: reason,
      cancelled_by: cancelledBy,
    },
    { new: true }
  )
    .populate("user", "-password")
    .populate("business");
};


   exports.editTicket = async (id, message) => {
  return await Ticket.findByIdAndUpdate(
    id,
    {
      message,
    },
    { new: true }
  )
    .populate("user", "-password")
    .populate("business");
};
