$("a").click(function () {
  $("html,body").animate(
    {
      scrollTop: $("#offer").offset().bottom,
    },
    "slow"
  )
})
